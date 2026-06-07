<?php
// Configuración
$destinatario = "matias@example.com"; // ← cambiá por el email real
$asunto_prefix = "[Web] ";

// Cabeceras de seguridad
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Solo acepta POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo json_encode(["ok" => false, "error" => "Método no permitido"]);
  exit;
}

// Lee los datos
$nombre  = strip_tags(trim($_POST["nombre"] ?? ""));
$email   = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$asunto  = strip_tags(trim($_POST["asunto"] ?? ""));
$mensaje = strip_tags(trim($_POST["mensaje"] ?? ""));

// Valida campos
if (empty($nombre) || empty($email) || empty($asunto) || empty($mensaje)) {
  echo json_encode(["ok" => false, "error" => "Todos los campos son obligatorios"]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(["ok" => false, "error" => "Email inválido"]);
  exit;
}

// Arma el email
$asunto_completo = $asunto_prefix . $asunto;
$cuerpo = "Nombre: $nombre\n";
$cuerpo .= "Email: $email\n\n";
$cuerpo .= "Mensaje:\n$mensaje";

$headers  = "From: $nombre <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Envía el email
$enviado = mail($destinatario, $asunto_completo, $cuerpo, $headers);

if ($enviado) {
  echo json_encode(["ok" => true]);
} else {
  echo json_encode(["ok" => false, "error" => "Error al enviar el email"]);
}
?>