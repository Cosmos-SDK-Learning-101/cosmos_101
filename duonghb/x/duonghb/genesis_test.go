package duonghb_test

import (
	"testing"

	keepertest "duonghb/testutil/keeper"
	"duonghb/testutil/nullify"
	"duonghb/x/duonghb"
	"duonghb/x/duonghb/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.DuonghbKeeper(t)
	duonghb.InitGenesis(ctx, *k, genesisState)
	got := duonghb.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
