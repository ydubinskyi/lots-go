package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"backend/internal/database"
	"backend/internal/handler"
	"backend/internal/service"
)

type Server struct {
	port int

	handlers *handler.Handlers
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	dbConnStr := os.Getenv("DB_URL")

	dbConn, err := database.Connect(dbConnStr)
	if err != nil {
		log.Fatalf("Database connection error: %s", err)
	}

	queries := database.New(dbConn)
	services := service.NewServices(queries, dbConn)
	handlers := handler.NewHandlers(services)

	s := &Server{
		port: port,

		handlers: handlers,
	}

	return &http.Server{
		Addr:         fmt.Sprintf(":%d", s.port),
		Handler:      s.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
}
