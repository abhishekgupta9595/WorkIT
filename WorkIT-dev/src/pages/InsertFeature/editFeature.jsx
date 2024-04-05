import { useContext, useState } from "react";
import { database, imgDB } from "../../database/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

import "./insertNewFeature.css";
import { LoaderContext } from "../../context/loaderContext";

const EditFeatureForm = (props) => {

  const mrLoader = useContext(LoaderContext);

  const [category, setCategory] = useState(props.item?.data().category);
  const [description, setDescription] = useState(props.item?.data().description);
  const [name, setName] = useState(props.item?.data().name);
  const [img, setImg] = useState(null);
  const [icon, setIcon] = useState(null);

  console.log("icon",icon)
  console.log("image",img)

    // console.log(img);
    // console.log(icon);

  // const value = doc(database, "features");

  const createData = async ( icnURL, imgURL,featureId) => {
    console.log("id",featureId);
    const docRef = doc(database,"features",featureId)

    if(icnURL && !imgURL){
        await updateDoc(docRef, {
            id:featureId,
            category: category.toLowerCase(),
            description: description.toLowerCase(),
            name: name.toLowerCase(),
            iconUrl: icnURL,
          });
    }else if(imgURL && !icnURL){
        await updateDoc(docRef, {
            id:featureId,
            category: category.toLowerCase(),
            description: description.toLowerCase(),
            name: name.toLowerCase(),
            imgUrl: imgURL,
          });
    }else if(imgURL && icnURL){
        await updateDoc(docRef, {
            id:featureId,
            category: category.toLowerCase(),
            description: description.toLowerCase(),
            name: name.toLowerCase(),
            iconUrl: icnURL,
            imgUrl: imgURL,
          });
    }else{
        await updateDoc(docRef, {
            id:featureId,
            category: category.toLowerCase(),
            description: description.toLowerCase(),
            name: name.toLowerCase(),
          });
    }

    alert("data edited Successfully");
    setCategory("");
    setDescription("");
    setName("");

  };

  const handleSubmit = async() => {

    mrLoader.setIsLoading(true);
    const featureId = props.item.id;

    if(img && !icon){
        const imgs = ref(imgDB, `Product/${name}/img/${featureId}`);
        uploadBytes(imgs, img).then((data) => {
          console.log(data, "imgs");
          getDownloadURL(data.ref).then((imgURL) => {
            console.log(imgURL);
            console.log("image uploaded");
            createData(null,imgURL,featureId).then(()=>{
              window.location.href="/admin";
              mrLoader.setIsLoading(false)
              
            }
            );
          });
        }).catch(error => console.log("img Error: ", error));
    }

    else if(icon && !img){
        console.log("function  started");
        const icons = ref(imgDB, `Product/${name}/icon/${featureId}`);
        uploadBytes(icons, icon).then((data) => {
          console.log(data, "imgs");
          getDownloadURL(data.ref).then((icnURL) => {
            console.log(icnURL)
            console.log("icon uploaded");
            createData(icnURL,null,featureId).then(()=>{
                window.location.href="/admin";
                mrLoader.setIsLoading(false);
            });
          });
        }).catch(error => console.log("icon Error: ", error));
    }

    else if(icon && img){
        console.log("function  started");
        const icons = ref(imgDB, `Product/${name}/icon/${featureId}`);
        uploadBytes(icons, icon).then((data) => {
          console.log(data, "imgs");
          getDownloadURL(data.ref).then((icnURL) => {
            console.log(icnURL)
            console.log("icon uploaded");

            const imgs = ref(imgDB, `Product/${name}/img/${featureId}`);
            uploadBytes(imgs, img).then((data) => {
              console.log(data, "imgs");
              getDownloadURL(data.ref).then((imgURL) => {
                console.log(imgURL);
                console.log("image uploaded");
                createData(icnURL,imgURL,featureId).then(()=>{
                  window.location.href="/admin";
                  mrLoader.setIsLoading(false)
                
                }
                );
              });
            }).catch(error => console.log("img Error: ", error));


          });
        }).catch(error => console.log("icon Error: ", error));
    }

    else{
        createData(null,null,featureId).then(()=>{
            window.location.href="/admin";
            mrLoader.setIsLoading(false)
            
        });
    }

  };
  return (
    <div className="new_feature_form_container">
      <div className="inner_box1">
        <div className="inner_box2">
          <h1 className="heading">Welcome Admin😎</h1>
          <div className="form_container">
            {/* <form> */}
              <div>
                <label className="input_label">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="App Name"
                  className="input_box"
                />
              </div>
              <div>
                <label className="input_label">Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  className="input_box"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="input_label">Description</label>
                <textarea
                //   type="textarea"
                  rows="10"
                  placeholder="Description"
                  className="text_area"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="input_label">Icon</label>
                <img src={props.item?.data().iconUrl} className="icon" alt="icon" />
                <input
                  type="file"
                  className="file_input"
                  onChange={(e) => setIcon(e.target.files[0])}
                  required
                />
              </div>
              <div>
                <label className="input_label">Image</label>
                <img src={props.item?.data().imgUrl} className="image" alt="image" />
                <input
                  type="file"
                  className="file_input"
                  onChange={(e) => setImg(e.target.files[0])}
                  required
                />
              </div>
              <div className="form_button">
                <button className="btn" onClick={() => handleSubmit()}>
                  Submit
                </button>
              </div>
            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFeatureForm;
