package handler

import (
	"net/http"

	"github.com/AlandSleman/StorageBox/prisma"
	"github.com/AlandSleman/StorageBox/prisma/db"
	"github.com/gin-gonic/gin"
)

func AdminUsers(c *gin.Context) {
	// Fetch the authenticated user
	userID := c.GetString("id")
	authUser, err := prisma.Client().User.FindUnique(
		db.User.ID.Equals(userID),
	).Exec(prisma.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch authenticated user"})
		return
	}

	users, err := prisma.Client().User.FindMany().With(db.User.Files.Fetch()).With(db.User.Folders.Fetch()).Exec(prisma.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	// Obfuscate user data for privacy reasons, for non admin users
	if len(users) > 0 {
		if authUser.Role != "admin" {
			for i, user := range users {
				users[i].Email = "*******@example.com"
				users[i].Password = "********"
				for j := range user.Folders() {
					users[i].Folders()[j].Name = "***"
				}
				for j := range user.Files() {
					users[i].Files()[j].Name = "***"
				}
			}

		}

	}

	// Return the list of users (with email addresses obfuscated and sensitive data modified if necessary)
	c.JSON(http.StatusOK, users)
}
