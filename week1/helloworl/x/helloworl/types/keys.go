package types

const (
	// ModuleName defines the module name
	ModuleName = "helloworl"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_helloworl"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
