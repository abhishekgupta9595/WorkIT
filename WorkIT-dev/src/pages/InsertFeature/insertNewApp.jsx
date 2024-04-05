import { useContext, useEffect, useState } from "react";
import { database, imgDB } from "../../database/firebaseConfig";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

import { v4 } from "uuid";
import "./insertNewFeature.css";
import { LoaderContext } from "../../context/loaderContext";

const NewAppForm = () => {

  const mrLoader = useContext(LoaderContext);

  const [features, setFeatures] = useState([]); // State to store fetched features
  const [featureArr, setFeatureArr] = useState([]); // State to store selected features
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [icon, setIcon] = useState("");

    // console.log(img);
    // console.log(icon);

  // const value = doc(database, "features");

  useEffect(()=>{
    getFeatures();
  },[])

  const getFeatures = async ()=>{
    const docRef = collection(database,"features");
    const docSnap = await getDocs(docRef);
    setFeatures(docSnap.docs);
  }

  const createData = async ( icnURL, imgURL,appId) => {
    console.log("id",appId);
    const docRef = doc(database,"apps",appId)

    await setDoc(docRef, {
      id:appId,
      category: category.toLowerCase(),
      description: description.toLowerCase(),
      name: name.toLowerCase(),
      features: featureArr,
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

    const appId = v4();
    console.log("function  started");
    const icons = ref(imgDB, `App/${name}/icon/${appId}`);
    uploadBytes(icons, icon).then((data) => {
      console.log(data, "imgs");
      getDownloadURL(data.ref).then((icnURL) => {
        console.log(icnURL)
        console.log("icon uploaded");

        const imgs = ref(imgDB, `App/${name}/img/${appId}`);
        uploadBytes(imgs, img).then((data) => {
          console.log(data, "imgs");
          getDownloadURL(data.ref).then((imgURL) => {
            console.log(imgURL);
            console.log("image uploaded");
            createData(icnURL,imgURL,appId).then(()=>{
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

  const handleFeatureSelection = (event) => {
    const selectedappId = event.target.value;

    // Check if the selected feature is already in featureArr
    const featureIndex = featureArr.findIndex((feature) => feature.id === selectedappId);
    if (featureIndex !== -1) {
      // If the feature is already selected, remove it from featureArr
      const updatedFeatures = [...featureArr];
      updatedFeatures.splice(featureIndex, 1);
      setFeatureArr(updatedFeatures);
    } else {
      // If the feature is not selected, add it to featureArr
      const selectedFeature = features.find((feature) => feature.id === selectedappId);
      if (selectedFeature) {
        setFeatureArr([...featureArr, {id:selectedFeature.id,name:selectedFeature.data().name,ref:selectedFeature.ref}]);
      }
    }
  };


  console.log("featureArr: ",featureArr);

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
                <label className="input_label">Features</label>
                <select
                  className="input_box"
                  multiple
                  value={featureArr.map((feature) => feature.id)} // Set selected options based on featureArr
                  onChange={handleFeatureSelection}
                >
                  {features?.map((feature) => (
                    <option key={feature.id} value={feature.id}>
                      {feature.data().name}
                    </option>
                  ))}
                </select>
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

export default NewAppForm;
