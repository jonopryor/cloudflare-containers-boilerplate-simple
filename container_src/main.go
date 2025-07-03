package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type Response struct {
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	Path      string    `json:"path"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	response := Response{
		Message:   "Container is healthy",
		Timestamp: time.Now(),
		Path:      r.URL.Path,
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func echoHandler(w http.ResponseWriter, r *http.Request) {
	response := Response{
		Message:   fmt.Sprintf("Echo: %s", r.URL.Path),
		Timestamp: time.Now(),
		Path:      r.URL.Path,
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/", echoHandler)
	
	port := ":8080"
	log.Printf("Starting server on port %s", port)
	
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}