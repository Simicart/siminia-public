import Abstract from '../Base'
import router from "./RouterConfig";
class AppRouter extends Abstract{

    renderLayout = ()=>{
        return(
            this.renderRoute(router)
        )
    }

    render(){
        return super.render()
    }

}
export default AppRouter;