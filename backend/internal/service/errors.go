package service

import "errors"

var (
	ErrCategoryNotFound         = errors.New("category not found")
	ErrAttributeNotFound        = errors.New("attribute not found")
	ErrAttributeAlreadyAttached = errors.New("attribute already attached to category")
	ErrAttributeNotAttached     = errors.New("attribute not attached to category")
)
