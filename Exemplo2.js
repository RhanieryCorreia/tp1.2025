const DB_NAME = 'MyDatabase';
const DB_VERSION = 2;
const STORE_NAME = 'MyObjectStore';

let db;

// Open or create the database
const request = indexedDB.open(DB_NAME, DB_VERSION);
// em caso de erro utiliza essa função abaixo
request.onerror = function(event) {
    console.error("IndexedDB error:", event.target.errorCode);
};
//em caso de sussesso no login
request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database opened successfully");
    mostrarRegistros();
};
//faz a veracidade nem sempre é necessário
request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        console.log("Object store created");
    }
};

// Add data to the object store. dataform chama o formulario do html. Poderia ser onclick no lugar do submit
// o form precisa do action para enviar. 
document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault(); //pode ser usado para um alerta. Impede o envio do formulário.
    const key = document.getElementById('keyInput').value; //rucha o keyinput
    const value = document.getElementById('valueInput').value; //rucha o valor(senha)

    const transaction = db.transaction([STORE_NAME], 'readwrite'); //readonly(leitura) readwrite(escreve)
    const objectStore = transaction.objectStore(STORE_NAME); 
    const addRequest = objectStore.add({ key: key, value: value }); //salva a chave e a senha

    //basicamente apenas apaga os inputs do html
    addRequest.onsuccess = function() {
        console.log("Data added successfully");
        document.getElementById('keyInput').value = '';
        document.getElementById('valueInput').value = '';
        mostrarRegistros(); //rucha tudo inserido no indexdb, até agora é bom para um sistema offile somente no navegador de outra pessoa.
    };

    addRequest.onerror = function() {
        console.error("Error adding data");
    };
});

function mostrarRegistros() {
    const transaction = db.transaction([STORE_NAME], 'readonly'); //le o objeto
    const objectStore = transaction.objectStore(STORE_NAME);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    //abre o cursor
    objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            outputDiv.innerHTML += `<p>Chave: ${cursor.value.key}, Valor: ${cursor.value.value}</p>`;
            cursor.continue();
        } else {
            console.log("All data retrieved");
        }
        //Este código só funciona na mesma área.
        //nada haver com o codigo = Live share exten-ção
    };
}