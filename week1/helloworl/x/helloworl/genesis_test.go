package helloworl_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	keepertest "helloworl/testutil/keeper"
	"helloworl/testutil/nullify"
	"helloworl/x/helloworl"
	"helloworl/x/helloworl/types"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.HelloworlKeeper(t)
	helloworl.InitGenesis(ctx, *k, genesisState)
	got := helloworl.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
