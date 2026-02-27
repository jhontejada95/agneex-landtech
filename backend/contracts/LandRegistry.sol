// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title LandRegistry
 * @dev Contrato para la notarización de linderos y documentos de tierras en Agneex LandTech.
 * Provee inmutabilidad y transparencia sobre los análisis de linderos.
 */
contract LandRegistry {
    address public owner;

    struct Record {
        string recordId;        // ID del expediente en el sistema local
        string documentHash;    // Hash SHA-256 del contenido del documento
        string aiVerdict;       // Veredicto del motor IA (ej: CLEAR, AMBIGUOUS)
        string upmeStatus;      // Estado de UPME (ej: LIBRE_DE_EXCLUSION, RIESGO)
        uint256 timestamp;      // Fecha de la notarización
        address notarizer;      // Wallet que registró el documento
    }

    mapping(string => Record) private records;
    string[] private recordIds;

    event DocumentNotarized(
        string indexed recordId,
        string documentHash,
        string aiVerdict,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el administrador puede notarizar documentos");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Registra un nuevo documento en la blockchain.
     */
    function notarizeDocument(
        string memory _recordId,
        string memory _documentHash,
        string memory _aiVerdict,
        string memory _upmeStatus
    ) public onlyOwner {
        require(bytes(records[_recordId].recordId).length == 0, "Este expediente ya ha sido notarizado");

        records[_recordId] = Record({
            recordId: _recordId,
            documentHash: _documentHash,
            aiVerdict: _aiVerdict,
            upmeStatus: _upmeStatus,
            timestamp: block.timestamp,
            notarizer: msg.sender
        });

        recordIds.push(_recordId);

        emit DocumentNotarized(_recordId, _documentHash, _aiVerdict, block.timestamp);
    }

    /**
     * @dev Recupera un registro de notarización.
     */
    function getRecord(string memory _recordId) public view returns (Record memory) {
        require(bytes(records[_recordId].recordId).length > 0, "Registro no encontrado");
        return records[_recordId];
    }

    /**
     * @dev Devuelve el número total de registros.
     */
    function getRecordsCount() public view returns (uint256) {
        return recordIds.length;
    }

    /**
     * @dev Permite transferir la propiedad del contrato (opcional).
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Direccion invalida");
        owner = _newOwner;
    }
}
