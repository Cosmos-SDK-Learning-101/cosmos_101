package lession1_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	keepertest "lession1/testutil/keeper"
	"lession1/testutil/nullify"
	"lession1/x/lession1"
	"lession1/x/lession1/types"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.Lession1Keeper(t)
	lession1.InitGenesis(ctx, *k, genesisState)
	got := lession1.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
