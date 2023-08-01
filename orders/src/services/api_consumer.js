const {default: axios} = require('axios');
const config = require('../../configs/config');

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

const validateRequestingByRestaurantId = async (restaurantId, requestBody) => {
    console.log("*******VALIDATE bbbbODYYYY: ", restaurantId);
    console.log(requestBody);
  try {
    const restaurant = await axios.patch(config.url_restaurant +`/validateRequesting/${restaurantId}`,
      requestBody
      // {
      //   // headers: {
      //   //     authorization: `Bearer ${token}`
      //   // }
      // }
    );
    console.log("BEFFFFFOOOORRRRE");  
      if (!restaurant) {
        console.log("NNNNNNNNNNNNNOOOOOOOONNNN")
    }
    console.log("ADDING REQUEST TO LABORATORY##############: ");
    // console.log(restaurant.data);
    return restaurant;
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

const getMenuById = async (menuId) => {
    
     try {
       const menu = await axios.get(config.url_menu + `/fetch/uno/${menuId}`, {
        //  headers: {
        //    authorization: `Bearer ${token}`,
        //  },
       });
       console.log("MENUUU: ");
       //console.log(menu.data);
       return menu;
     } catch (err) {
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
  validateRequestingByRestaurantId,
  getMenuById,
};