<?php
function show($data)
{
    echo $data . PHP_EOL;
}
function getConexion($config)
{
    $conn = null; // Create connection
    $conn = mysqli_connect(
        $config["servername"],
        $config["username"],
        $config["password"],
        $config["database"]
    );
    if (!$conn) {
        $mensajeError = "ERROR DE CONEXION EN DbClient - HOLA!! ";
        $mensajeError .= "[servername : " . $config["servername"] . "]";
        $mensajeError .= "[username : " . $config["username"] . "]";
        $mensajeError .= "[database : " . $config["database"] . "]";
        $mensajeError .= "[error no : " . mysqli_connect_errno() . "]";
        $mensajeError .= "[error : " . mysqli_connect_error() . "]";
        show($mensajeError);


        exit($mensajeError);
    }
    mysqli_set_charset($conn, "utf8");
    show("devolviendo conexión");
    return $conn;
}

$config = [
    "servername" => "192.168.1.20",
    "username" => "root",
    "password" => "indumark670b",
    "database" => "indumark",
];
$sql = "SELECT * from z_factura_compra";

show("uno");
$conn = getConexion($config);
$result = mysqli_query($conn, $sql);
show("dos");
if ($result !== false) {
    $row = $result->fetch_array(MYSQLI_NUM);
        show("exito");
        show(json_encode($row));
    
} else {
    show($sql);
}