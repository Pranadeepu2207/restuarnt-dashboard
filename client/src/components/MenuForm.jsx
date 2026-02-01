import { useState, useEffect } from "react";
import api from "../services/api";

function MenuForm({ fetchMenu, selectedItem, clearSelection }) {
    const [form, setForm] = useState({
        name: "",
        category: "Main Course",
        price: "",
        description: "",
        ingredients: ""
    });

    // ✅ Prefill form when Edit is clicked
    useEffect(() => {
        if (selectedItem) {
            setForm({
                name: selectedItem.name || "",
                category: selectedItem.category || "Main Course",
                price: selectedItem.price || "",
                description: selectedItem.description || "",
                ingredients: selectedItem.ingredients?.join(",") || ""
            });
        }
    }, [selectedItem]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...form,
            ingredients: form.ingredients.split(",")
        };

        if (selectedItem) {
            await api.put(`/menu/${selectedItem._id}`, data);
            clearSelection();
        } else {
            await api.post("/menu", data);
        }

        fetchMenu();

        // clear form after submit
        setForm({
            name: "",
            category: "Main Course",
            price: "",
            description: "",
            ingredients: ""
        });
    };

    return (
        <form onSubmit={handleSubmit} className="border p-4 rounded mb-4 grid grid-cols-2 gap-2">
            <h3 className="col-span-2 font-bold">
                {selectedItem ? "Edit Menu Item" : "Add Menu Item"}
            </h3>

            <input
                className="border p-2"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
            />

            <input
                className="border p-2"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
            />

            <input
                className="border p-2 col-span-2"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
            />

            <input
                className="border p-2 col-span-2"
                name="ingredients"
                placeholder="Ingredients (comma separated)"
                value={form.ingredients}
                onChange={handleChange}
            />

            <select
                className="border p-2 col-span-2"
                name="category"
                value={form.category}
                onChange={handleChange}
            >
                <option>Appetizer</option>
                <option>Main Course</option>
                <option>Dessert</option>
                <option>Beverage</option>
            </select>

            <button className="bg-green-500 text-white p-2 rounded col-span-2">
                {selectedItem ? "Update Item" : "Add Item"}
            </button>

            {selectedItem && (
                <button
                    type="button"
                    onClick={clearSelection}
                    className="bg-gray-400 text-white p-2 rounded col-span-2"
                >
                    Cancel Edit
                </button>
            )}
        </form>
    );
}

export default MenuForm;
