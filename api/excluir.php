<?php
require '../includes/config.php';
require '../includes/conexao.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->id)) {
    http_response_code(400);
    echo json_encode(["mensagem" => "ID do usuário é obrigatório"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $data->id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["mensagem" => "Usuário excluído com sucesso"]);
    } else {
        http_response_code(404);
        echo json_encode(["mensagem" => "Usuário não encontrado"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["mensagem" => "Erro ao excluir usuário", "erro" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>