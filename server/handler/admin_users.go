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

	// Fetch all users with their files and folders
	users, err := prisma.Client().User.FindMany().Exec(prisma.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	// Obfuscate user data for privacy reasons
	if len(users) > 0 {
		if authUser.Role != "admin" {
			for i := range users {
				users[i].Email = "*******@example.com"
				users[i].Password = "********"
			}
		}
	}

	// Return the list of users (with email addresses obfuscated and sensitive data modified if necessary)
	c.JSON(http.StatusOK, users)
}