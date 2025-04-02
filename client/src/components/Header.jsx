function Header() {
    return (
        <header>
            <div className='branding'>
                <i className="bi bi-flower3"></i>
                <h1>Verdant</h1>
            </div>
            <div className='bar-fill'></div>
            <div className='user-controls'>
                <div className='user-icon'>
                    <i className="bi bi-person-circle"></i>
                </div>
            </div>
        </header>
    );
}

export default Header;