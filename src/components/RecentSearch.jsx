function RecentSearch({recentHistory, setRecentHistory, setSelectedHistory}) {
     // For adding Button to clear the history
      const clearHistory = () => {
        localStorage.clear();
        setRecentHistory([]);
      }

      const clearSelectedHistory = (selectedItem) =>{
        let history = JSON.parse(localStorage.getItem('history'));
        history = history.filter((item)=>{
            if(item !== selectedItem){
                return item;
            }
        })
        setRecentHistory(history);
        localStorage.setItem('history',JSON.stringify(history));
      }

    return (
        <>
            <div className="col-span-1  dark:bg-zinc-800 bg-red-100 pt-3">

                {/* For showing history on UI left bar */}
                <h1 className='text-xl dark:text-white text-zinc-700 flex justify-between p-5'>

                    <span><u><i>Recent Search</i></u></span>

                    <button className='cursor-pointer' onClick={clearHistory}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#BB271A"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /></svg></button>
                </h1>
                <ul className='text-left overflow-auto text-sm '>
                    {
                        recentHistory && recentHistory.map((item, index) => (

                            <div className="flex justify-between pr-3 py-1">
                            <li onClick={() => setSelectedHistory(item)} key={item + Math.random()} className='w-full pt-1 pl-5 px-5 truncate dark:text-zinc-400 text-zinc-700 cursor-pointer dark:hover:text-white hover:text-zinc-900 dark:hover:bg-zinc-500 hover:bgred-200'>{item}</li>

                            <button className='cursor-pointer hover:bg-zinc-900 bg-zinc-700' onClick={()=>clearSelectedHistory(item)} ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#BB271A"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /></svg></button>
                            </div>
                        ))
                    }
                </ul>

            </div>
        </>
    )
}

export default RecentSearch