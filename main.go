package main

import (
	"fmt"
	"net/http"

	"github.com/AidanTilgner/benchy/server"
)

func main() {
	r := server.Router()

	fmt.Println("Starting server on :8080")
	http.ListenAndServe(":8080", r)
}
