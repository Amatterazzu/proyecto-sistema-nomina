-- =============================================
-- SISTEMA DE NÓMINA - SEGUROS ESCUINTLEGOS
-- Código SQL completo con procedimientos almacenados
-- =============================================

CREATE DATABASE IF NOT EXISTS sistema_nomina;
USE sistema_nomina;

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

CREATE TABLE Puestos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    salario_base DECIMAL(10,2) NOT NULL
);

CREATE TABLE Empleados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    puesto_id INT,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (puesto_id) REFERENCES Puestos(id)
);

CREATE TABLE Nominas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT,
    mes INT NOT NULL,
    año INT NOT NULL,
    salario_base DECIMAL(10,2),
    bonificacion DECIMAL(10,2) DEFAULT 250.00,
    igss_laboral DECIMAL(10,2),
    igss_patronal DECIMAL(10,2),
    isr DECIMAL(10,2),
    salario_neto DECIMAL(10,2),
    FOREIGN KEY (empleado_id) REFERENCES Empleados(id)
);

-- =============================================
-- INSERCIÓN DE DATOS
-- =============================================

INSERT INTO Puestos (nombre, salario_base) VALUES 
('Gerente', 25000.00),
('Jefe', 18000.00),
('Vendedor de Seguros', 15000.00);

INSERT INTO Empleados (nombre, puesto_id) VALUES
('Juan Pérez García', 1),
('María López Hernández', 1),
('Carlos Martínez Díaz', 2),
('Ana Rodríguez Silva', 2),
('Pedro Gómez Cruz', 2),
('Laura Hernández Reyes', 3),
('Miguel Ángel Castro Luna', 3),
('Sofía Vargas Paredes', 3),
('José Luis Mora Ríos', 3),
('Karla Estrada Nuñez', 3),
('Roberto Sánchez Mejía', 3),
('Diana Flores Ochoa', 3),
('Fernando Ramírez Toledo', 3),
('Gabriela Ruiz Campos', 3),
('Ricardo Mendoza León', 3),
('Patricia Castro Salazar', 3),
('Oscar Duarte Jiménez', 3),
('Silvia Rojas Velásquez', 3),
('Manuel Torres Navarro', 3),
('Elena Ortega Peña', 3);

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS REQUERIDOS
-- =============================================

DELIMITER //

-- Procedimiento para calcular nómina individual
CREATE PROCEDURE CalcularNominaIndividual(
    IN p_empleado_id INT,
    IN p_mes INT,
    IN p_año INT
)
BEGIN
    DECLARE v_salario_base DECIMAL(10,2);
    DECLARE v_bonificacion DECIMAL(10,2) DEFAULT 250.00;
    DECLARE v_igss_laboral DECIMAL(10,2);
    DECLARE v_igss_patronal DECIMAL(10,2);
    DECLARE v_isr DECIMAL(10,2);
    DECLARE v_salario_neto DECIMAL(10,2);
    DECLARE v_puesto_id INT;
    
    -- Obtener salario base del empleado
    SELECT e.puesto_id, p.salario_base INTO v_puesto_id, v_salario_base
    FROM Empleados e
    JOIN Puestos p ON e.puesto_id = p.id
    WHERE e.id = p_empleado_id;
    
    IF v_salario_base IS NOT NULL THEN
        -- Calcular IGSS laboral (4.83%)
        SET v_igss_laboral = v_salario_base * 0.0483;
        
        -- Calcular IGSS patronal (12.67%)
        SET v_igss_patronal = v_salario_base * 0.1267;
        
        -- Calcular ISR (ejemplo simplificado)
        IF v_salario_base <= 30000 THEN
			SET v_isr = v_salario_base * 0.05;
		ELSEIF v_salario_base <= 50000 THEN
			SET v_isr = 1500 + (v_salario_base - 30000) * 0.07;
		ELSE
			SET v_isr = 2900 + (v_salario_base - 50000) * 0.10;
		END IF;
        
        -- Calcular salario neto
        SET v_salario_neto = v_salario_base + v_bonificacion - v_igss_laboral - v_isr;
        
        -- Insertar en tabla de nóminas
        INSERT INTO Nominas (empleado_id, mes, año, salario_base, bonificacion, 
                           igss_laboral, igss_patronal, isr, salario_neto)
        VALUES (p_empleado_id, p_mes, p_año, v_salario_base, v_bonificacion,
                v_igss_laboral, v_igss_patronal, v_isr, v_salario_neto);
    END IF;
END //

-- Procedimiento para calcular nómina mensual usando CURSOR
CREATE PROCEDURE CalcularNominaMensual(
    IN p_mes INT,
    IN p_año INT
)
BEGIN
    DECLARE v_empleado_id INT;
    DECLARE v_final INT DEFAULT 0;
    
    DECLARE cur_empleados CURSOR FOR 
    SELECT id FROM Empleados WHERE activo = TRUE;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_final = 1;
    
    OPEN cur_empleados;
    
    bucle_empleados: LOOP
        FETCH cur_empleados INTO v_empleado_id;
        
        IF v_final = 1 THEN
            LEAVE bucle_empleados;
        END IF;
        
        CALL CalcularNominaIndividual(v_empleado_id, p_mes, p_año);
        
    END LOOP bucle_empleados;
    
    CLOSE cur_empleados;
END //

-- Procedimiento para generar nóminas de los últimos 10 meses
CREATE PROCEDURE GenerarNominasUltimos10Meses()
BEGIN
    DECLARE v_mes INT;
    DECLARE v_contador INT DEFAULT 0;
    
    WHILE v_contador < 10 DO
        SET v_mes = v_contador + 1;
        CALL CalcularNominaMensual(v_mes, 2024);
        SET v_contador = v_contador + 1;
    END WHILE;
END //

-- Procedimiento para seleccionar empleados
CREATE PROCEDURE SeleccionarEmpleados()
BEGIN
    SELECT 
        e.id,
        e.nombre,
        p.nombre AS puesto,
        p.salario_base
    FROM Empleados e
    JOIN Puestos p ON e.puesto_id = p.id
    WHERE e.activo = TRUE
    ORDER BY e.id;
END //

-- Procedimiento para insertar empleado
CREATE PROCEDURE InsertarEmpleado(
    IN p_nombre VARCHAR(100),
    IN p_puesto_id INT
)
BEGIN
    INSERT INTO Empleados (nombre, puesto_id) 
    VALUES (p_nombre, p_puesto_id);
END //

-- Procedimiento para modificar empleado
CREATE PROCEDURE ModificarEmpleado(
    IN p_empleado_id INT,
    IN p_nombre VARCHAR(100),
    IN p_puesto_id INT
)
BEGIN
    UPDATE Empleados 
    SET nombre = p_nombre, puesto_id = p_puesto_id 
    WHERE id = p_empleado_id;
END //

DELIMITER ;

-- =============================================
-- EJECUCIÓN DE PROCEDIMIENTOS
-- =============================================

-- Generar todas las nóminas
CALL GenerarNominasUltimos10Meses();

-- Ver empleados
CALL SeleccionarEmpleados();

-- Ver reporte de nóminas
SELECT 
    n.mes,
    n.año,
    e.nombre AS empleado,
    p.nombre AS puesto,
    n.salario_base,
    n.bonificacion,
    n.igss_laboral,
    n.igss_patronal,
    n.isr,
    n.salario_neto
FROM Nominas n
JOIN Empleados e ON n.empleado_id = e.id
JOIN Puestos p ON e.puesto_id = p.id
ORDER BY n.año, n.mes, e.nombre;