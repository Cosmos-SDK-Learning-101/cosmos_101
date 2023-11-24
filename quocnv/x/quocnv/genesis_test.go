package quocnv_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	keepertest "quocnv/testutil/keeper"
	"quocnv/testutil/nullify"
	"quocnv/x/quocnv"
	"quocnv/x/quocnv/types"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.QuocnvKeeper(t)
	quocnv.InitGenesis(ctx, *k, genesisState)
	got := quocnv.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
