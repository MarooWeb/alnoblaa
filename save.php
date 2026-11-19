<?php
/**
 * save.php — يحفظ تعديلات لوحة التحكم مباشرة على السيرفر (مدرسة النبلاء).
 * ضعه في جذر الموقع، في نفس المجلد اللي فيه index.html.
 *
 * ===================== تنبيه أمني مهم =====================
 * كلمة السر (SAVE_SECRET) مكتوبة أيضًا داخل script.js الذي يصل إلى متصفح
 * أي زائر للموقع. أي شخص يفتح "عرض المصدر" (View Source) في متصفحه يمكنه
 * رؤية هذه القيمة إرسال تعديلات مباشرة لهذا الملف دون الدخول للوحة التحكم
 * إطلاقًا. لذلك:
 *   - استخدم قيمة طويلة وعشوائية (وليس كلمة عادية)، وغيّرها بين وقت وآخر.
 *   - غيّرها في هذا الملف وفي script.js معًا (القيمتان لازم تتطابقا).
 *   - فعّل، إن أمكن، الحماية الإضافية الموصوفة أسفل (قفل .htaccess / IP).
 * ============================================================
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

// ---------------------------------------------------------------
// الإعدادات — غيّر القيمة دي لتطابق SAVE_SECRET في script.js بالضبط
// ---------------------------------------------------------------
const SAVE_SECRET  = 'Maroo 2010@';
const TARGET_FILE  = __DIR__ . '/assets/files/content.js';
const LOCK_FILE    = __DIR__ . '/assets/files/.save_lock.json';
const MAX_ATTEMPTS = 8;     // عدد محاولات كلمة السر الخاطئة المسموح بها
const LOCK_MINUTES = 15;    // مدة القفل بعد تجاوز المحاولات
const MAX_BODY     = 8 * 1024 * 1024; // أقصى حجم مسموح للبيانات المرسلة (8MB)

// اختياري: لو عايز تقصر الاستخدام على IP ثابت بتاعك، فك التعليق وحط الـIP بتاعك
// $ALLOWED_IPS = ['123.45.67.89'];
// if (!empty($ALLOWED_IPS) && !in_array($_SERVER['REMOTE_ADDR'] ?? '', $ALLOWED_IPS, true)) {
//     http_response_code(403);
//     echo json_encode(['ok' => false, 'error' => 'غير مسموح من هذا العنوان.']);
//     exit;
// }

function fail(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('يُسمح فقط بطلبات POST.', 405);
}

// ---------------------------------------------------------------
// قفل مؤقت بعد محاولات كلمة سر خاطئة متكررة (حماية من التخمين الآلي)
// ---------------------------------------------------------------
$lock = ['n' => 0, 't' => 0];
if (is_file(LOCK_FILE)) {
    $tmp = json_decode((string) @file_get_contents(LOCK_FILE), true);
    if (is_array($tmp)) {
        $lock = $tmp;
    }
}
if (($lock['n'] ?? 0) >= MAX_ATTEMPTS && (time() - ($lock['t'] ?? 0)) < LOCK_MINUTES * 60) {
    fail('عدد كبير من محاولات كلمة السر الخاطئة. حاول بعد ' . LOCK_MINUTES . ' دقيقة.', 429);
}

// ---------------------------------------------------------------
// قراءة الطلب
// ---------------------------------------------------------------
$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > MAX_BODY) {
    fail('البيانات المرسلة كبيرة جدًا أو غير مقروءة.', 413);
}

$body = json_decode($raw, true);
if (!is_array($body)) {
    fail('صيغة الطلب غير صالحة.');
}

$pw   = $body['pw']   ?? '';
$data = $body['data'] ?? null;

// ---------------------------------------------------------------
// التحقق من كلمة السر
// ---------------------------------------------------------------
if (!is_string($pw) || !hash_equals(SAVE_SECRET, $pw)) {
    $lock['n'] = (int) ($lock['n'] ?? 0) + 1;
    $lock['t'] = time();
    @file_put_contents(LOCK_FILE, json_encode($lock), LOCK_EX);
    usleep(400000); // تبطيء محاولات التخمين
    fail('كلمة السر غير صحيحة.', 403);
}

// نجح التحقق: صفّر عداد المحاولات الخاطئة
if (($lock['n'] ?? 0) > 0) {
    @file_put_contents(LOCK_FILE, json_encode(['n' => 0, 't' => 0]), LOCK_EX);
}

if ($data === null) {
    fail('لا توجد بيانات لحفظها.');
}

// ---------------------------------------------------------------
// تحويل البيانات لنص JS صالح
// ---------------------------------------------------------------
$json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false) {
    fail('تعذر تحويل البيانات إلى JSON صالح.');
}

$content = "window.SITE_CFG=" . $json . ";\n";

// ---------------------------------------------------------------
// حفظ ذري: كتابة في ملف مؤقت ثم استبدال الملف الأصلي دفعة واحدة
// ---------------------------------------------------------------
$dir = dirname(TARGET_FILE);
if (!is_dir($dir) || !is_writable($dir)) {
    fail('مجلد assets/files غير قابل للكتابة على السيرفر. تأكد أن صلاحياته 755 على الاستضافة.', 500);
}

$tmpFile = $dir . '/.content_' . bin2hex(random_bytes(6)) . '.tmp';
if (@file_put_contents($tmpFile, $content, LOCK_EX) === false) {
    fail('فشل الحفظ المؤقت على السيرفر. تحقق من صلاحيات الكتابة.', 500);
}

if (!@rename($tmpFile, TARGET_FILE)) {
    @unlink($tmpFile);
    fail('فشل استبدال ملف content.js. تحقق من صلاحيات الكتابة.', 500);
}
@chmod(TARGET_FILE, 0644);

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
