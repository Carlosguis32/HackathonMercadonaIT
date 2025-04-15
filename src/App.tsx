import { useState, useEffect } from "react";
import type { DragEvent } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Chat } from "./components/ui/chat";

interface Producto {
    id: string;
    nombre: string;
    categoria: string;
    precio?: number;
    cantidad?: number;
    imagen?: string;
}

function App() {
    const [listaUno, setListaUno] = useState<Producto[]>([]);
    const [listaDos, setListaDos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filterProductos = (productos: Producto[]) => {
        const term = searchTerm.toLowerCase();
        return productos.filter(
            (producto) =>
                producto.nombre.toLowerCase().includes(term) ||
                producto.categoria.toLowerCase().includes(term)
        );
    };

    const incrementarCantidad = (id: string) => {
        setListaDos((prevList) =>
            prevList.map((producto) =>
                producto.id === id
                    ? { ...producto, cantidad: (producto.cantidad || 1) + 1 }
                    : producto
            )
        );
    };

    const decrementarCantidad = (id: string) => {
        setListaDos((prevList) =>
            prevList.map((producto) =>
                producto.id === id && (producto.cantidad || 1) > 1
                    ? { ...producto, cantidad: (producto.cantidad || 1) - 1 }
                    : producto
            )
        );
    };

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    "http://localhost:3001/api/productos"
                );

                if (!response.ok) {
                    throw new Error("Error al obtener los productos");
                }

                const data: Producto[] = await response.json();
                setListaUno(data);
                setListaDos([]);
                setError(null);
            } catch (err) {
                console.error("Error:", err);
                setError(
                    "No se pudieron cargar los productos. Asegúrate de que el servidor está en ejecución."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const [dragging, setDragging] = useState<string | null>(null);

    const handleDragStart = (
        e: DragEvent<HTMLDivElement>,
        producto: Producto,
        origen: "uno" | "dos"
    ) => {
        e.dataTransfer.setData("productoId", producto.id);
        e.dataTransfer.setData("origen", origen);
        setDragging(producto.id);
    };

    const handleDrop = (
        e: DragEvent<HTMLDivElement>,
        destino: "uno" | "dos"
    ) => {
        e.preventDefault();
        const productoId = e.dataTransfer.getData("productoId");
        const origen = e.dataTransfer.getData("origen") as "uno" | "dos";

        if (origen === destino) return;

        let producto: Producto | undefined;
        if (origen === "uno") {
            producto = listaUno.find((p: Producto) => p.id === productoId);
            if (producto) {
                setListaUno(
                    listaUno.filter((p: Producto) => p.id !== productoId)
                );
                setListaDos([...listaDos, { ...producto, cantidad: 1 }]);
            }
        } else {
            producto = listaDos.find((p: Producto) => p.id === productoId);
            if (producto) {
                setListaDos(
                    listaDos.filter((p: Producto) => p.id !== productoId)
                );
                setListaUno([
                    ...listaUno,
                    { ...producto, cantidad: undefined },
                ]);
            }
        }

        setDragging(null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragEnd = () => {
        setDragging(null);
    };

    const handleEmptyCart = () => {
        setListaUno((prev) => [
            ...prev,
            ...listaDos.map((producto) => ({
                ...producto,
                cantidad: undefined,
            })),
        ]);
        setListaDos([]);
    };

    const calcularTotal = () => {
        return listaDos.reduce(
            (total, producto) =>
                total + (producto.precio || 0) * (producto.cantidad || 1),
            0
        );
    };

    const handleAddProductsFromChat = (productos: Producto[]) => {
        productos.forEach((producto) => {
            const existingProduct = listaUno.find((p) => p.id === producto.id);
            if (existingProduct) {
                setListaUno((prev) => prev.filter((p) => p.id !== producto.id));
                setListaDos((prev) => [
                    ...prev,
                    { ...existingProduct, cantidad: 1 },
                ]);
            }
        });
    };

    return (
        <div className="flex h-screen bg-green-50">
            <div className="flex-1 p-8 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                    <img
                        src="/src/assets/mercadona.png"
                        alt="Logo de Mercadona"
                        className="absolute top-10 left-10 h-20 w-auto z-10 pointer-events-none opacity-80"
                    />
                </div>
                <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
                    Productos disponibles
                </h1>

                <div className="mb-6 flex justify-center items-center">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-green-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 text-green-700 hover:text-green-800 hover:bg-green-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        <p>{error}</p>
                        <p className="text-sm mt-2">
                            Asegúrate de iniciar el servidor con el comando:
                            node src/server/server.js
                        </p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle className="text-green-800">
                                Productos Disponibles
                            </CardTitle>
                            <CardDescription className="text-green-700">
                                Arrastra productos a tu cesta
                            </CardDescription>
                        </CardHeader>
                        <CardContent
                            className="border-2 border-dashed border-green-300 rounded-md p-4 min-h-[300px] h-[300px] overflow-y-auto"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, "uno")}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {filterProductos(listaUno).map(
                                        (producto) => (
                                            <div
                                                key={producto.id}
                                                draggable
                                                onDragStart={(e) =>
                                                    handleDragStart(
                                                        e,
                                                        producto,
                                                        "uno"
                                                    )
                                                }
                                                onDragEnd={handleDragEnd}
                                                className={`p-2 bg-white border rounded-md shadow-sm cursor-move transition-all hover:shadow-md ${
                                                    dragging === producto.id
                                                        ? "opacity-50"
                                                        : "opacity-100"
                                                }`}
                                            >
                                                <div className="w-full aspect-square mb-1 rounded-md overflow-hidden">
                                                    <img
                                                        src={producto.imagen}
                                                        alt={producto.nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="font-medium text-sm text-green-800 truncate">
                                                    {producto.nombre}
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-300 text-green-700 text-xs"
                                                    >
                                                        {producto.categoria}
                                                    </Badge>
                                                    {producto.precio && (
                                                        <span className="text-xs font-semibold text-green-800">
                                                            {producto.precio.toFixed(
                                                                2
                                                            )}
                                                            €
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <div className="text-sm text-green-500">
                                {listaUno.length} productos en esta lista
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle className="text-green-800">
                                Cesta de la Compra
                            </CardTitle>
                            <CardDescription className="text-green-700">
                                Arrastra productos aquí
                            </CardDescription>
                        </CardHeader>
                        <CardContent
                            className="border-2 border-dashed border-green-300 rounded-md p-4 min-h-[300px] h-[300px] overflow-y-auto"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, "dos")}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {filterProductos(listaDos).map(
                                        (producto) => (
                                            <div
                                                key={producto.id}
                                                draggable
                                                onDragStart={(e) =>
                                                    handleDragStart(
                                                        e,
                                                        producto,
                                                        "dos"
                                                    )
                                                }
                                                onDragEnd={handleDragEnd}
                                                className={`p-2 bg-white border rounded-md shadow-sm cursor-move transition-all hover:shadow-md ${
                                                    dragging === producto.id
                                                        ? "opacity-50"
                                                        : "opacity-100"
                                                }`}
                                            >
                                                <div className="w-full aspect-square mb-1 rounded-md overflow-hidden">
                                                    <img
                                                        src={producto.imagen}
                                                        alt={producto.nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="font-medium text-sm text-green-800 truncate">
                                                    {producto.nombre}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-300 text-green-700 text-xs w-fit"
                                                    >
                                                        {producto.categoria}
                                                    </Badge>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-0 border rounded border-green-300 bg-white">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 hover:bg-green-600 hover:text-white transition-colors"
                                                                onClick={() =>
                                                                    decrementarCantidad(
                                                                        producto.id
                                                                    )
                                                                }
                                                            >
                                                                -
                                                            </Button>
                                                            <span className="w-6 text-center text-green-800 text-xs">
                                                                {producto.cantidad ||
                                                                    1}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 hover:bg-green-600 hover:text-white transition-colors"
                                                                onClick={() =>
                                                                    incrementarCantidad(
                                                                        producto.id
                                                                    )
                                                                }
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                        {producto.precio && (
                                                            <span className="text-xs font-semibold text-green-800">
                                                                {(
                                                                    (producto.precio ||
                                                                        0) *
                                                                    (producto.cantidad ||
                                                                        1)
                                                                ).toFixed(2)}
                                                                €
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <div className="text-sm text-green-500">
                                {listaDos.length} productos en esta lista
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-lg font-semibold text-green-800">
                                    Total: {calcularTotal().toFixed(2)}€
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleEmptyCart}
                                    disabled={listaDos.length === 0}
                                    className="border-green-500 text-green-800 hover:bg-green-500 hover:text-white transition-colors"
                                >
                                    Vaciar cesta
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className="w-100 border-l p-4 bg-white">
                <Chat
                    productosDisponibles={listaUno}
                    productosSeleccionados={listaDos}
                    onAddToCart={handleAddProductsFromChat}
                />
            </div>
        </div>
    );
}

export default App;
