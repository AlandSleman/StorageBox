package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func DirExists(c *gin.Context) {
	// ensuring that the dir header is present
	dir := c.GetHeader("dir")
	if dir == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Missing dir header"})
		return
	}
	c.Set("dir", dir)

	if dir == "/" {
		c.Set("avatar", "true")
	}

	c.Next()
}
