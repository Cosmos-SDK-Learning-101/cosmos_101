import { readFile } from "fs/promises"
import { fromHex } from "@cosmjs/encoding"
import { DirectSecp256k1Wallet, OfflineDirectSigner } from "@cosmjs/proto-signing"

import { IndexedTx, SigningStargateClient, StargateClient } from "@cosmjs/stargate"
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx"
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx"

const rpc = "127.0.0.1:26657";

const getAliceSignerFromPriKey = async (): Promise<OfflineDirectSigner> => {
    return DirectSecp256k1Wallet.fromKey(
        fromHex((await readFile("./simd.alice.private.key")).toString()),
        "cosmos",
    )
}

const runAll = async (): Promise<void> => {
    const client = await StargateClient.connect(rpc);
    console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight());

    const faucet: string = "cosmos19evtgf2cqf3fv78w0wk2428jv0xeev6we2z05p"

    const aliceSigner: OfflineDirectSigner = await getAliceSignerFromPriKey();

    const alice = (await aliceSigner.getAccounts())[0].address;
    console.log("Alice's address from signer", alice);

    const signingClient = await SigningStargateClient.connectWithSigner(rpc, aliceSigner);

    console.log(
        "With signing client, chain id:",
        await signingClient.getChainId(),
        ", height:",
        await signingClient.getHeight()
    );

    // console.log("Gas fee:", decodedTx.authInfo!.fee!.amount);
    // console.log("Gas limit:", decodedTx.authInfo!.fee!.gasLimit.toString(10));

    // Check the balance of Alice and the Faucet
    console.log("Alice balance before:", await client.getAllBalances(alice));
    console.log("Faucet balance before:", await client.getAllBalances(faucet));
    // Execute the sendTokens Tx and store the result
    const result = await signingClient.sendTokens(
        alice,
        faucet,
        [{ denom: "stake", amount: "1000000" }],
        {
            amount: [{ denom: "stake", amount: "500" }],
            gas: "200000",
        },
    );
    // Output the result of the Tx
    console.log("Transfer result:", result);

    console.log("Alice balance after:", await client.getAllBalances(alice));
    console.log("Faucet balance after:", await client.getAllBalances(faucet));
}

runAll()
