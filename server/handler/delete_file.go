package handler

import (
	"github.com/AlandSleman/StorageBox/prisma"
	"github.com/AlandSleman/StorageBox/prisma/db"
	"github.com/gin-gonic/gin"
	"net/http"
)

func DeleteFile(c *gin.Context) {

	var Body struct {
		FileId string `json:"id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&Body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
		return
	}

	userID := c.GetString("id")

	_, err := prisma.Client().File.FindMany(
		db.File.And(db.File.UserID.Equals(userID), db.File.ID.Equals(Body.FileId)),
	).Delete().Exec(prisma.Context())

	if err != nil {
    println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to delete file"})
		return
	}

	// userOwnsFolder := false
	// for _, folder := range user.Folders() {
	// 	if folder.ID == NewFolderBody.ParentID {
	// 		userOwnsFolder = true
	// 		break
	// 	}
	// }

	// if userOwnsFolder == false {
	// 	c.JSON(http.StatusBadRequest, gin.H{"message": "User doesn't own folder"})
	// 	return
	// }

	// folderName := NewFolderBody.Name

	// newFolder, err := prisma.Client().Folder.CreateOne(
	// 	db.Folder.Name.Set(folderName),
	// 	db.Folder.User.Link(db.User.ID.Equals(userID)),
	// 	db.Folder.Parent.Link(db.Folder.ID.Equals(NewFolderBody.ParentID)),
	// ).Exec(prisma.Context())

	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to create folder"})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"message": "success"})
	return
}