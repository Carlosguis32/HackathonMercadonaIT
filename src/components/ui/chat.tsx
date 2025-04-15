import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

interface Message {
    text: string;
    isUser: boolean;
    parts?: string[];
    currentPart?: number;
}

interface Producto {
    id: string;
    nombre: string;
    categoria: string;
    precio?: number;
    cantidad?: number;
    imagen?: string;
}

interface ChatProps {
    productosDisponibles: Producto[];
    productosSeleccionados: Producto[];
    onAddToCart?: (productos: Producto[]) => void;
}

export function Chat({
    productosDisponibles,
    productosSeleccionados,
    onAddToCart,
}: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const presetQuestions = [
        "Hazme una dieta con los productos de mi cesta",
        "Recomiéndame productos saludables",
        "Añade a mi cesta los productos para hacer una tortilla de patatas",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMessages((prevMessages) => {
                return prevMessages.map((message) => {
                    if (
                        !message.isUser &&
                        message.parts &&
                        message.currentPart !== undefined
                    ) {
                        if (message.currentPart < message.parts.length - 1) {
                            return {
                                ...message,
                                text: message.parts
                                    .slice(0, message.currentPart + 2)
                                    .join("\n\n"),
                                currentPart: message.currentPart + 1,
                            };
                        }
                    }
                    return message;
                });
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    const handlePresetQuestion = (question: string) => {
        handleSubmit(new Event("submit") as any, question);
    };

    const handleSubmit = async (
        e: React.FormEvent,
        presetQuestion?: string
    ) => {
        e.preventDefault();
        const messageText = presetQuestion || inputValue;
        if (!messageText.trim()) return;

        console.log("Productos disponibles:", productosDisponibles);
        console.log("Productos seleccionados:", productosSeleccionados);

        if (
            !Array.isArray(productosDisponibles) ||
            productosDisponibles.length === 0
        ) {
            const errorMessage =
                "Error: No hay productos disponibles para procesar tu solicitud.";
            console.error(errorMessage);
            setMessages((prev) => [
                ...prev,
                { text: messageText, isUser: true },
                { text: errorMessage, isUser: false },
            ]);
            return;
        }

        const validProducts = productosDisponibles.every(
            (p) =>
                p.id &&
                p.nombre &&
                p.categoria &&
                typeof p.precio !== "undefined"
        );

        if (!validProducts) {
            const errorMessage =
                "Error: La estructura de los productos no es válida.";
            console.error(errorMessage);
            setMessages((prev) => [
                ...prev,
                { text: messageText, isUser: true },
                { text: errorMessage, isUser: false },
            ]);
            return;
        }

        const userMessage = { text: messageText, isUser: true };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const requestData = {
                prompt: messageText,
                productosDisponibles,
                productosSeleccionados: productosSeleccionados || [],
            };

            console.log(
                "Enviando al servidor:",
                JSON.stringify(requestData, null, 2)
            );

            const response = await fetch("http://localhost:3001/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Error en la respuesta del servidor"
                );
            }

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            const parts = data.response.split("\n\n").filter(Boolean);

            if (data.productos && data.productos.length > 0 && onAddToCart) {
                onAddToCart(data.productos);
            }

            const aiMessage: Message = {
                text: parts[0],
                isUser: false,
                parts: parts,
                currentPart: 0,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    text: "Lo siento, ha ocurrido un error al procesar tu mensaje.",
                    isUser: false,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader>
                <CardTitle>Chat Asistente</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col gap-2 w-full">
                        {presetQuestions.map((question, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="text-left w-full whitespace-normal break-words min-h-[44px] justify-start"
                                onClick={() => handlePresetQuestion(question)}
                            >
                                {question}
                            </Button>
                        ))}
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.isUser ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                message.isUser
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <form onSubmit={handleSubmit} className="w-full flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="flex-grow px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Enviando..." : "Enviar"}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
