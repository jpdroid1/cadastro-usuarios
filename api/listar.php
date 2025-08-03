<?php
require '../includes/config.php';
require '../includes/conexao.php';

$sql = "SELECT id, nome, email, telefone, DATE_FORMAT(criado_em, '%d/%m/%Y %H:%i') as criado_em 
        FROM usuarios ORDER BY criado_em DESC";
$result = $conn->query($sql);

$usuarios = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
}

echo json_encode($usuarios);
$conn->close();
?>