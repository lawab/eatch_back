const { fieldsRequired } = require("../models/recette");
const { fieldsValidator } = require("../models/validators");
const recetteServices = require("../services/recetteServices");
const roles = require("../models/roles");
const setForeignFieldsValue = require("./setForeignFieldsValue");
const updateForeignFields = require("./updateForeignFields");
// create one recette in database
const createRecette = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    
    console.log("body===============")
    	
    	    console.log({body})
    
    console.log("body===============")
    //let body = req.body;
    // check if creator has authorization
    let creator = await recetteServices.getUserAuthor(
      body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }
    body["_creator"] = creator?._id;

    body = await setForeignFieldsValue(recetteServices, body, req.token);

    console.log({ engredients: body["engredients"] });

    // add image from recette
    body["image"] = req.file
      ? "/datas/" + req.file?.filename
      : "/datas/avatar.png";

    let recette = await recetteServices.createRecette(body);
    // print({ recette }, "*");

    if (recette?._id) {
      return res
        .status(200)
        .json({ message: "recette has been created successfully!!!" });
    } else {
      return res
        .status(401)
        .json({ message: "recette has been not created successfully!!!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occured during a creation of recette!!!" });
  }
};

// update recette in database
const updateRecette = async (req, res) => {
  try {
    let body = JSON.parse(req.headers.body);
    // let body = req.body;

    // get the auathor to update recette
    let creator = await recetteServices.getUserAuthor(
      body?._creator,
      req.token
    );
    // const { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    // if user has authorization to update recette
    if ([roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      let recette = await recetteServices.findRecette({
        _id: req.params?.id,
      });

      if (!recette) {
        return res.status(401).json({
          message: "unable to update recette because it not exists!!!",
        });
      }
      body = await updateForeignFields(recetteServices, body, req.token);

      // update all valid fields before save it in database
      for (let key in body) {
        if (fieldsRequired.includes(key)) {
          recette[key] = body[key];
          console.log({ key: body[key] });
        }
      }
      // update recette in database
      let recetteUpdated = await recette.save();
      console.log({ recetteUpdated });
      if (recetteUpdated?._id) {
        res
          .status(200)
          .json({ message: "recette has been updated successfully!!" });
      } else {
        res.status(401).json({
          message: "recette update failed: recette not exits in database!!",
        });
      }
    } else {
      return res.status(401).json({
        message: "you cannot update the recette please see you admin,thanks!!!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erros occured during the update recette!!!",
    });
  }
};
// delete one recette in database
const deleteRecette = async (req, res) => {
  try {
    // check if creator has authorization
    let creator = await recetteServices.getUserAuthor(
      req.body?._creator,
      req.token
    );
    if (!creator?._id) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }
    // if user has authorization to delete recette
    if ([roles.SUPER_ADMIN, roles.MANAGER].includes(creator.role)) {
      // find and delete recette
      let recetteDeleted = await recetteServices.deleteOne(
        {
          _id: req.params?.id,
          deletedAt: null,
        },
        { _creator: creator._id, deletedAt: Date.now() } //set user creator and the date of deletion,no drop recette
      );

      // if recette not exits or had already deleted
      if (!recetteDeleted?._id) {
        return res
          .status(401)
          .json({ message: "recette not exists or already deleted" });
      }
      // recette exits and had deleted successfully
      if (recetteDeleted.deletedAt) {
        console.log({ recetteDeleted: recetteDeleted._id });
        return res
          .status(200)
          .json({ message: "recette has been delete sucessfully" });
      } else
        return res.status(500).json({ message: "deletion of recette failed" });
    } else {
      return res.status(401).json({
        message: "you cannot delete the recette please see you admin,thanks!!!",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error(s) occured during the deletion of recette!!!" });
  }
};
// get one recette in database
const fetchRecette = async (req, res) => {
  try {
    let recette = await recetteServices.findRecette({
      _id: req.params?.id,
    });
    console.log({ recette });
    if (recette?._id) {
      res.status(200).json(recette);
    } else {
      res.status(401).json({ message: "recette not found!!!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get recettes in database
const fetchRecettes = async (req, res) => {
  try {
    let ids = req.params?.ids ? JSON.parse(req.params?.ids) : [];
    if (ids.length) {
      let recettes = await recetteServices.findRecettes({
        _id: { $in: ids },
      });
      console.log({ ids });
      res.status(200).json(recettes);
    } else {
      let recettes = await recetteServices.findRecettes();
      res.status(200).json(recettes);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch recettes by restaurant in database
const fetchrecettesByRestaurant = async (req, res) => {
  try {
    let recettes = await recetteServices.findRecettes({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(recettes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

module.exports = {
  createRecette,
  deleteRecette,
  fetchRecettes,
  updateRecette,
  fetchRecette,
  fetchrecettesByRestaurant,
};
