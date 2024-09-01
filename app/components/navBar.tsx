const NavBar = () => {
    return (
        <header className="bg-blue-500 text-white p-4 z-50 fixed top-0 left-0 w-full">
            <nav className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">TaskMate</h1>
                <ul className="flex space-x-4">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/about" className="hover:underline">About</a></li>
                    <li><a href="/contact" className="hover:underline">Contact</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default NavBar