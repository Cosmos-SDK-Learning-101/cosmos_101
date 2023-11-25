package keeper_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	testkeeper "lession1/testutil/keeper"
	"lession1/x/lession1/types"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.Lession1Keeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
