import { useContext, useState } from "react";
import { database, imgDB } from "../../database/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

import { v4 } from "uuid";
import "./insertNewFeature.css";
import { LoaderContext } from "../../context/loaderContext";

const NewFeatureForm = () => {

  const mrLoader = useContext(LoaderContext);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [icon, setIcon] = useState("");

    // console.log(img);
    // console.log(icon);

  // const value = doc(database, "features");

  const createData = async ( icnURL, imgURL,featureId) => {
    console.log("id",featureId);
    const docRef = doc(database,"features",featureId)

    await setDoc(docRef, {
      id:featureId,
      category: category.toLowerCase(),
      description: description.toLowerCase(),
      name: name.toLowerCase(),
      iconUrl: icnURL,
      imgUrl: imgURL,
    });

    alert("data inserted Successfully");
    setCategory("");
    setDescription("");
    setName("");

  };

  const handleSubmit = async() => {

    mrLoader.setIsLoading(true);

    const featureId = v4();
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
              alert("Feature had been added successfully...");
              mrLoader.setIsLoading(false)
              
            }
            );
          });
        }).catch(error => console.log("img Error: ", error));

        
      });
    }).catch(error => console.log("icon Error: ", error));
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
                  rows="5"
                  placeholder="Description"
                  className="input_box"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="input_label">Icon</label>
                <input
                  type="file"
                  className="file_input"
                  onChange={(e) => setIcon(e.target.files[0])}
                  required
                />
              </div>
              <div>
                <label className="input_label">Image</label>
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

export default NewFeatureForm;
