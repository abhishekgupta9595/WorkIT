import Shop from "./pages/Shop/Shop";
import { BrowserRouter, Routes, Route,} from "react-router-dom";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp";
import Home from "./pages/Home/Home";
import ItemPreview from "./components/shopPage/itemPreview";
import Cart from "./components/cart/Cart";
import { UserProvider } from "./context/userContext";
import { QueryProvider } from "./context/queryContext";
import NewFeatureForm from "./pages/InsertFeature/insertNewFeature";
import { ButtonProvider } from "./context/buttonContext";
import { LoaderProvider } from "./context/loaderContext";
import LoadingScreen from "./components/loadingScreen/loadingScreen";
import Admin from "./pages/admin/admin";
import EditFeatureForm from "./pages/InsertFeature/editFeature";
import AppsList from "./components/shopPage/appsList";
import NewAppForm from "./pages/InsertFeature/insertNewApp";
import AppPreview from "./components/shopPage/AppPreview";


function App() {
  return (
    <>
      <UserProvider>
        <LoaderProvider>
          <BrowserRouter>
            <LoadingScreen/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/loginsignup" element={<LoginSignUp />} />
              <Route path="/shop" element={
                <QueryProvider>
                  <ButtonProvider>
                    <Shop />
                  </ButtonProvider>
                </QueryProvider>} />
              <Route path="product/:productId" element={<ItemPreview />} />
              <Route path="app/:appId" element={<AppPreview/>}/>
              <Route path="/shoppingCart" element={<Cart />} />
              <Route path="/new" element={<NewFeatureForm />} />
              <Route path="/admin" element={<Admin/>}/>
              <Route path="/edit" element={<EditFeatureForm/>}/>
              <Route path="/apps" element={<AppsList/>}/>
              <Route path="/newapp" element={<NewAppForm/>}/>
            </Routes>
          </BrowserRouter>
        </LoaderProvider>
      </UserProvider>
    </>
  );
}

export default App;

