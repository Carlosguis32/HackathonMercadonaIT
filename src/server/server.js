import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

app.use(cors());
app.use(express.json());

const productos = [
    {
        id: "1",
        nombre: "Manzanas",
        categoria: "Frutas",
        precio: 2.5,
        imagen: "/images/Manzanas.png",
    },
    {
        id: "2",
        nombre: "Plátanos",
        categoria: "Frutas",
        precio: 1.8,
        imagen: "/images/Plátanos.png",
    },
    {
        id: "3",
        nombre: "Naranjas",
        categoria: "Frutas",
        precio: 2.2,
        imagen: "/images/Naranjas.png",
    },
    {
        id: "4",
        nombre: "Peras",
        categoria: "Frutas",
        precio: 2.3,
        imagen: "/images/Peras.png",
    },
    {
        id: "5",
        nombre: "Fresas",
        categoria: "Frutas",
        precio: 3.5,
        imagen: "/images/Fresas.png",
    },
    {
        id: "6",
        nombre: "Uvas",
        categoria: "Frutas",
        precio: 2.8,
        imagen: "/images/Uvas.png",
    },
    {
        id: "7",
        nombre: "Kiwis",
        categoria: "Frutas",
        precio: 3.2,
        imagen: "/images/Kiwis.png",
    },
    {
        id: "8",
        nombre: "Melocotones",
        categoria: "Frutas",
        precio: 2.4,
        imagen: "/images/Melocotones.png",
    },
    {
        id: "9",
        nombre: "Sandía",
        categoria: "Frutas",
        precio: 4.5,
        imagen: "/images/Sandía.png",
    },
    {
        id: "10",
        nombre: "Melón",
        categoria: "Frutas",
        precio: 3.8,
        imagen: "/images/Melón.png",
    },

    {
        id: "11",
        nombre: "Tomates",
        categoria: "Verduras",
        precio: 2.1,
        imagen: "/images/Tomates.png",
    },
    {
        id: "12",
        nombre: "Zanahorias",
        categoria: "Verduras",
        precio: 1.4,
        imagen: "/images/Zanahorias.png",
    },
    {
        id: "13",
        nombre: "Patatas",
        categoria: "Verduras",
        precio: 1.3,
        imagen: "/images/Patatas.png",
    },
    {
        id: "14",
        nombre: "Cebollas",
        categoria: "Verduras",
        precio: 1.2,
        imagen: "/images/Cebollas.png",
    },
    {
        id: "15",
        nombre: "Pimientos",
        categoria: "Verduras",
        precio: 2.3,
        imagen: "/images/Pimientos.png",
    },
    {
        id: "16",
        nombre: "Pepinos",
        categoria: "Verduras",
        precio: 1.8,
        imagen: "/images/Pepinos.png",
    },
    {
        id: "17",
        nombre: "Berenjenas",
        categoria: "Verduras",
        precio: 2.1,
        imagen: "/images/Berenjenas.png",
    },
    {
        id: "18",
        nombre: "Calabacines",
        categoria: "Verduras",
        precio: 1.9,
        imagen: "/images/Calabacines.png",
    },
    {
        id: "19",
        nombre: "Lechugas",
        categoria: "Verduras",
        precio: 1.2,
        imagen: "/images/Lechugas.png",
    },

    {
        id: "20",
        nombre: "Leche Entera",
        categoria: "Lácteos",
        precio: 0.95,
        imagen: "/images/Leche Entera.png",
    },
    {
        id: "21",
        nombre: "Leche Desnatada",
        categoria: "Lácteos",
        precio: 0.98,
        imagen: "/images/Leche Desnatada.png",
    },
    {
        id: "22",
        nombre: "Queso Fresco",
        categoria: "Lácteos",
        precio: 3.25,
        imagen: "/images/Queso Fresco.png",
    },
    {
        id: "23",
        nombre: "Queso Curado",
        categoria: "Lácteos",
        precio: 4.5,
        imagen: "/images/Queso Curado.png",
    },
    {
        id: "24",
        nombre: "Yogur Natural",
        categoria: "Lácteos",
        precio: 1.75,
        imagen: "/images/Yogur Natural.png",
    },
    {
        id: "25",
        nombre: "Yogur de Frutas",
        categoria: "Lácteos",
        precio: 1.95,
        imagen: "/images/Yogur de Frutas.png",
    },
    {
        id: "26",
        nombre: "Mantequilla",
        categoria: "Lácteos",
        precio: 2.8,
        imagen: "/images/Mantequilla.png",
    },
    {
        id: "29",
        nombre: "Queso Rallado",
        categoria: "Lácteos",
        precio: 2.4,
        imagen: "/images/Queso Rallado.png",
    },

    {
        id: "35",
        nombre: "Magdalenas",
        categoria: "Panadería",
        precio: 1.8,
        imagen: "/images/Magdalenas.png",
    },
    {
        id: "36",
        nombre: "Pan de Molde",
        categoria: "Panadería",
        precio: 1.9,
        imagen: "/images/Pan de Molde.png",
    },
    {
        id: "37",
        nombre: "Napolitanas",
        categoria: "Panadería",
        precio: 1.1,
        imagen: "/images/Napolitanas.png",
    },
    {
        id: "40",
        nombre: "Palmeras",
        categoria: "Panadería",
        precio: 1.2,
        imagen: "/images/Palmeras.png",
    },

    {
        id: "41",
        nombre: "Pollo Entero",
        categoria: "Carnicería",
        precio: 5.9,
        imagen: "/images/Pollo Entero.png",
    },
    {
        id: "42",
        nombre: "Huevos",
        categoria: "Panadería",
        precio: 1.2,
        imagen: "/images/Huevos.png",
    },
];

app.get("/api/productos", (req, res) => {
    res.json(productos);
});

app.get("/api/categorias/:categoria", (req, res) => {
    const categoria = req.params.categoria;
    const productosFiltrados = productos.filter(
        (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
    );

    res.json(productosFiltrados);
});

app.post("/api/chat", async (req, res) => {
    try {
        const { prompt, productosDisponibles, productosSeleccionados } =
            req.body;

        console.log("\n=== Nueva solicitud de chat ===");
        console.log("Prompt recibido:", prompt);
        console.log(
            "Productos disponibles:",
            JSON.stringify(productosDisponibles, null, 2)
        );
        console.log(
            "Productos seleccionados:",
            JSON.stringify(productosSeleccionados, null, 2)
        );

        if (!Array.isArray(productosDisponibles)) {
            throw new Error("productosDisponibles debe ser un array");
        }

        if (productosDisponibles.length === 0) {
            throw new Error("No hay productos disponibles");
        }

        const productosDisponiblesText = productosDisponibles
            .map((p) => `${p.nombre} (${p.categoria}) - ${p.precio}€`)
            .join("\n");

        const productosSeleccionadosText =
            productosSeleccionados && productosSeleccionados.length > 0
                ? productosSeleccionados
                      .map(
                          (p) =>
                              `${p.nombre} (${p.categoria}) x${
                                  p.cantidad || 1
                              } - ${p.precio}€`
                      )
                      .join("\n")
                : "No hay productos seleccionados aún";

        const enrichedPrompt = `
        Como asistente experto en nutrición y alimentación, utiliza la siguiente información para responder:

        PRODUCTOS DISPONIBLES:
        ${productosDisponiblesText}

        PRODUCTOS EN LA CESTA:
        ${productosSeleccionadosText}

        CONSULTA DEL USUARIO:
        ${prompt}

        INSTRUCCIONES:
        - Si el usuario pide añadir productos a la cesta, lista claramente los productos que deberían añadirse.
        - Si estás recomendando productos para una receta, enumera los productos necesarios.
        - Responde basándote únicamente en los productos listados arriba
        - Limita tu respuesta a tres párrafos cortos y concisos
        - Si es una consulta sobre dieta, menciona productos específicos de la lista
        - Estructura tu respuesta de manera clara y progresiva`;

        console.log("\nPrompt enriquecido enviado al modelo:", enrichedPrompt);

        const result = await model.generateContent(enrichedPrompt);
        const response = await result.response;
        const text = response.text();

        const productosParaAñadir = [];
        if (
            prompt.toLowerCase().includes("añade") ||
            prompt.toLowerCase().includes("agregar") ||
            prompt.toLowerCase().includes("poner")
        ) {
            productosDisponibles.forEach((producto) => {
                if (
                    text.toLowerCase().includes(producto.nombre.toLowerCase())
                ) {
                    productosParaAñadir.push(producto);
                }
            });
        }

        console.log("\nRespuesta del modelo:", text);
        console.log("Productos detectados para añadir:", productosParaAñadir);
        console.log("=== Fin de la solicitud ===\n");

        const paragraphs = text
            .split("\n\n")
            .filter((p) => p.trim())
            .slice(0, 3);

        res.json({
            response: paragraphs.join("\n\n"),
            productos: productosParaAñadir,
        });
    } catch (error) {
        console.error("Error en /api/chat:", error);

        if (error.message?.includes("PERMISSION_DENIED")) {
            return res.status(429).json({
                error: "Error de autenticación con Google AI. Por favor, verifica tu API key.",
                details:
                    "Asegúrate de que tu API key es válida y tiene los permisos necesarios.",
            });
        }

        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
