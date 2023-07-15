const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {

    it("Test 1: Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto.", async () => {
        const response = await request(server).get("/cafes");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it("Test 2: Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe.", async () => {
        const idInexistente = 100;
        const token = "token-de-autorizacion";

        const response = await request(server)
            .delete(`/cafes/${idInexistente}`)
            .set("Authorization", token);

        expect(response.statusCode).toBe(404);
    });

    it("Test 3: Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201.", async () => {
        const nuevoCafe = {
            id: 5,
            nombre: "Latte",
        };
        const response = await request(server)
            .post("/cafes")
            .send(nuevoCafe);
        expect(response.statusCode).toBe(201);

        // Verificar que el nuevo café se encuentra en la lista de cafés
        const responseCafes = await request(server).get("/cafes");
        expect(responseCafes.body).toContainEqual(nuevoCafe);
    });

    it("Test 4: Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload.", async () => {
        const cafeExistente = {
            id: 1,
            nombre: "Cortado Modificado",
        };
        const response = await request(server)
            .put(`/cafes/${cafeExistente.id + 1}`)
            .send(cafeExistente);
        expect(response.statusCode).toBe(400);
    });
});
