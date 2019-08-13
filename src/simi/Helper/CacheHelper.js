class CacheHelper {
    static clearCaches = (clearLocalStorage = true, clearSessionStorage = true) => {
        if (navigator && navigator.serviceWorker)
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(const registration of registrations) {
                    registration.unregister()
                } });
                
        if(typeof(caches) !== "undefined"){
            caches.keys().then(function(names) {
                for (const name of names)
                    caches.delete(name);
            });
        }
        if (clearLocalStorage && window && window.localStorage)
            window.localStorage.clear();

        if (clearSessionStorage && window && window.sessionStorage)
            window.sessionStorage.clear();
    }
}

export default CacheHelper