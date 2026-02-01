import { useEffect, useState } from "react";
import api from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import MenuForm from "../components/MenuForm";

function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [availability, setAvailability] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    const debouncedSearch = useDebounce(search, 300);

    const fetchMenu = async () => {
        const params = {};

        if (category) params.category = category;
        if (availability) params.isAvailable = availability;

        const res = await api.get("/menu", { params });
        setMenu(res.data);
    };

    useEffect(() => {
        fetchMenu();
    }, [category, availability]);

    useEffect(() => {
        if (debouncedSearch) {
            searchMenu();
        } else {
            fetchMenu();
        }
    }, [debouncedSearch]);

    const searchMenu = async () => {
        const res = await api.get(`/menu/search?q=${debouncedSearch}`);
        setMenu(res.data);
    };

    const deleteItem = async (id) => {
        await api.delete(`/menu/${id}`);
        fetchMenu();
    };

    const toggleAvailability = async (id, status) => {
        const oldMenu = [...menu];

        setMenu(
            menu.map((item) =>
                item._id === id ? { ...item, isAvailable: !status } : item,
            ),
        );

        try {
            await api.patch(`/menu/${id}/availability`);
        } catch {
            setMenu(oldMenu);
            alert("Update failed");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Menu Management</h1>

            <MenuForm
                fetchMenu={fetchMenu}
                selectedItem={selectedItem}
                clearSelection={() => setSelectedItem(null)}
            />

            <div className="flex gap-3 my-4">
                <input
                    className="border p-2 rounded w-full"
                    placeholder="Search menu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border p-2 rounded"
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option>Appetizer</option>
                    <option>Main Course</option>
                    <option>Dessert</option>
                    <option>Beverage</option>
                </select>

                <select
                    className="border p-2 rounded"
                    onChange={(e) => setAvailability(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {menu.map((item) => (
                    <div key={item._id} className="border p-4 rounded shadow">
                        <h3 className="font-bold">{item.name}</h3>
                        <p>{item.category}</p>
                        <p>₹{item.price}</p>
                        <p className={item.isAvailable ? "text-green-600" : "text-red-600"}>
                            {item.isAvailable ? "Available" : "Not Available"}
                        </p>

                        <div className="flex gap-2 mt-2">
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={() => toggleAvailability(item._id, item.isAvailable)}
                            >
                                Toggle
                            </button>
                            <button
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                onClick={() => setSelectedItem(item)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => deleteItem(item._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuPage;
