const Footer = () => {
    const date: number = new Date().getFullYear();
    return (
        <div className = "fixed bottom-0 w-full h-30 p-4 bg-blue-500 text-whitesmoke text-center"
        >
            Made with <i className='fas fa-heart-pulse fa-beat text-red-500'
                         style={{ '--fa-animation-duration': '2s' } as React.CSSProperties}></i> by Edgar Montenegro!
            <br/>
            All rights reserved &copy; {date}
        </div>
    )
}

export default Footer