package keeper_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	testkeeper "quocnv/testutil/keeper"
	"quocnv/x/quocnv/types"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.QuocnvKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
