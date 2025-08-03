<?php
require '../includes/config.php';
require '../includes/conexao.php';

$dados = json_decode(file_get_contents("php://input"));

if (!$dados || empty($dados->nome) || empty($dados->email) || empty($dados->telefone)) {
    http_response_code(400);
    echo json_encode(["mensagem" => "Todos os campos são obrigatórios."]);
    exit;
}


$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $dados->email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["mensagem" => "Este email já está cadastrado."]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();


$stmt = $conn->prepare("INSERT INTO usuarios (nome, email, telefone) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $dados->nome, $dados->email, $dados->telefone);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        "mensagem" => "Usuário cadastrado com sucesso!",
        "id" => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "mensagem" => "Erro ao cadastrar usuário.",
        "erro" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>