export const DashboardFooter =() =>{
    return (
        <div className=" text-xl fixed bottom-0 left-0 right-0 bg-black border-t border-[#25272a] py-3 px-6 flex justify-around text-[#494a4b] md:hidden" style={{zIndex: "1000"}}>

    <a href="market.php" className="">
        <div className="flex flex-col items-center">
            <span>
                <i className="fa-regular fa-compass"></i>
            </span>
            <span className="text-xs">Explore</span>
        </div>
    </a>

    <a href="index.php" className="active">
        <div className="flex flex-col items-center">
            <span><i className="fa-solid fa-wallet"></i></span>
            <span className="text-xs">Wallets</span>
        </div>
    </a>

    <a href="trade/" className="">
        <div className="flex flex-col items-center">
            <span><i className="fa-solid fa-square-poll-vertical"></i></span>
            <span className="text-xs">Trade</span>
        </div>
    </a>

    <a href="swaps.php" className="">
        <div className="flex flex-col items-center">
            <span><i className="fa-solid fa-tachograph-digital"></i></span>
            <span className="text-xs">Swap</span>
        </div>
    </a>

    <a href="earn.php" className="">
        <div className="flex flex-col items-center">
            <span><i className="fa-solid fa-coins"></i></span>
            <span className="text-xs">Earn</span>
        </div>
    </a>
</div>
    );
}