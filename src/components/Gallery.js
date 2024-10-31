import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Pour la popup

    useEffect(() => {
        const fetchImages = async () => {
            const response = await axios.get('http://localhost:8000/api/images/');
            setImages(response.data);
        };
        fetchImages();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image_file', imageFile);

        await axios.post('http://localhost:8000/api/images/', formData);
        setTitle('');
        setImageFile(null);
        // Refetch images after adding a new one
        const response = await axios.get('http://localhost:8000/api/images/');
        setImages(response.data);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8000/api/images/${id}/`);
        setImages(images.filter(image => image.id !== id));
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="p-4">
            {/* Form to add new images */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Image Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border rounded p-2 w-full"
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="border rounded p-2 w-full"
                        required
                    />

                </div>
                <button type="submit" className="text-center w-full mt-4 bg-blue-500 text-white rounded p-2">
                    Add Image
                </button>
            </form>

            {/* Gallery Table */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Photo
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {images.map((image) => (
                        <tr key={image.id} className="odd:bg-white  even:bg-gray-50  border-b ">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                {image.title}
                            </td>
                            <td className="px-6 py-4">
                                <img
                                    src={image.image_file}
                                    alt={image.title}
                                    className="w-16 h-16 object-cover cursor-pointer"
                                    onClick={() => handleImageClick(image)} // Ajout du click sur l'image
                                />
                            </td>
                            <td className="px-6 py-4">
                                <button onClick={() => handleDelete(image.id)} className="font-medium text-red-600 hover:underline">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Popup Modal for Image */}
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg">
                        <h2 className="text-lg font-bold mb-2">{selectedImage.title}</h2>
                        <img src={selectedImage.image_file} alt={selectedImage.title} className="max-w-full max-h-[80vh] object-contain" />
                        <button onClick={closeModal} className="mt-4 bg-red-500 text-white rounded px-4 py-2">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
