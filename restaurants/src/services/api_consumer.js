const {default: axios} = require('axios');
const config = require('../configs/config');

const getUserById = async (userId, token) =>{
    //console.log("*******USER ID: "+userId);
    //console.log("*******URL: "+config.url_user+`/fetch/one/${userId}`);
    try{
        const user = await axios.get(config.url_user+`/fetch/one/${userId}`,
                        {
                            headers: {
                                authorization: `Bearer ${token}`
                            }
                        });
        console.log("USERRRR: ")
        console.log(user.data);
        return user;
    }
    catch(err ){
        console.log(err.data);
        return err;
    }
    
}

const getLaboratoryById = async (laboratoryId, token) => {
  //console.log("*******USER ID: "+userId);
  //console.log("*******URL: "+config.url_user+`/fetch/one/${userId}`);
  try {
    const laboratory = await axios.get(
      config.url_laboratory + `/fetch/one/${laboratoryId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("USERRRR: ");
    // console.log(laboratory.data);
    return laboratory;
  } catch (err) {
    //console.log(err.data);
    return err;
  }
};

const getMaterialById = async (materialId, token) => {
  //console.log("*******USER ID: "+userId);
  //console.log("*******URL: "+config.url_user+`/fetch/one/${userId}`);
  try {
    const material = await axios.get(
      config.url_semiMaterial + `/fetch/one/${materialId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("USERRRR: ");
    // console.log(material.data);
    return material;
  } catch (err) {
    //console.log(err.data);
    return err;
  }
};

const addClassToUserById = async (userId, classBody) =>{
    console.log("*******CLASSE ID: ");
    console.log(classBody);
    console.log("*******USER ID: "+userId);
    console.log("*******URL: "+config.url_user+`/addClass/${userId}`);
    try{
        const user = await axios.patch(config.url_user+`/addClass/${userId}`,
                        {  body: classBody
                            // headers: {
                            //     authorization: `Bearer ${token}`
                            // }
                        });
        console.log("ADD COURSE TO USER##############: ")
        console.log(user.data);
        return user;
    }
    catch(err ){
        console.log(err.data);
        return err;
    }
    
}

const removeClassToUserById = async (userId) =>{
    console.log("*******CLASSE ID: ");
    //console.log(classBody);
    console.log("*******USER ID: "+userId);
    console.log("*******URL: "+config.url_user+`/removeClass/${userId}`);
    try{
        const user = await axios.patch(config.url_user+`/removeClass/${userId}`,
                        { 
                            // headers: {
                            //     authorization: `Bearer ${token}`
                            // }
                        });
        console.log("ADD COURSE TO USER##############: ")
        console.log(user.data);
        return user;
    }
    catch(err ){
        console.log(err.data);
        return err;
    }
    
}

const removeClassToCourseById = async (courseId, classeId) =>{
    console.log("*******CLASSE ID: ");
    console.log(classeId);
    console.log("*******COURSE ID: "+courseId);
    console.log("*******URL: "+config.url_course+`/removeClass/${classeId}`);
    try{
        const course = await axios.patch(config.url_course+`/removeClass/${courseId}/${classeId}`,
                        { 
                            // headers: {
                            //     authorization: `Bearer ${token}`
                            // }
                        });
        console.log("ADD COURSE TO USER##############: ")
        console.log(course.data);
        return course;
    }
    catch(err ){
        console.log(err.data);
        return err;
    }
    
}

const addClassToCourseById = async (courseId, classeId) =>{
    console.log("*******CLASSE ID: ");
    console.log(classeId);
    console.log("*******COURSE ID: "+courseId);
    console.log("*******URL: "+config.url_course+`/addClass/${courseId}`);
    try{
        const course = await axios.patch(config.url_course+`/addClass/${courseId}/${classeId}`,
                        {  
                            // headers: {
                            //     authorization: `Bearer ${token}`
                            // }
                        });
        console.log("ADD COURSE TO USER##############: ")
        console.log(course.data);
        return course;
    }
    catch(err ){
        console.log(err.data);
        return err;
    }
    
}

const addRequestingById = async (laboratoryId, requestBody) => {
  // console.log("*******REQUESTBOSY: ");
  // console.log(requestBody);
  try {
    const laboratory = await axios.patch(
      config.url_laboratory + `/addRequesting/${laboratoryId}`,
      { body: requestBody }
      // {
      //   // headers: {
      //   //     authorization: `Bearer ${token}`
      //   // }
      // }
    );
    console.log("ADDING REQUEST TO LABORATORY##############: ");
    console.log(laboratory.data);
    return laboratory;
  } catch (err) {
    console.log(err.data);
    return err;
  }
};

const getCourseById = async (courseId, token) =>{
    console.log("*******SUBJECT ID: "+courseId);
    console.log("*******URL: "+config.url_course+`/fetch/one/${courseId}`);
    try{
        const course = await axios.get(config.url_course+`/fetch/one/${courseId}`,
                        {
                            headers: {
                                authorization: `Bearer ${token}`
                            }
                        });
        console.log("SUBBBJECT : ")
        console.log(course.data);
        return course;
    }
    catch(err ){
        console.log(err.data);
        return err;
    }
    
}

module.exports = {
  getUserById,
  addClassToUserById,
  addClassToCourseById,
  getCourseById,
  removeClassToUserById,
  removeClassToCourseById,
  getLaboratoryById,
  getMaterialById,
  addRequestingById,
};