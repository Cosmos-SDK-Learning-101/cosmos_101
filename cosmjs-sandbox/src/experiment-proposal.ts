import { readFile } from "fs/promises"
import { fromHex } from "@cosmjs/encoding"
import { DirectSecp256k1Wallet, OfflineDirectSigner } from "@cosmjs/proto-signing"
import { SigningStargateClient, StargateClient, MsgSubmitProposalEncodeObject, MsgDelegateEncodeObject, MsgVoteEncodeObject } from "@cosmjs/stargate"
import { Any } from "cosmjs-types/google/protobuf/any";
import { TextProposal, VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { coin, coins, makeCosmoshubPath, Secp256k1HdWallet } from "@cosmjs/amino";
import { validator } from "@cosmjs/stargate/build/testutils.spec";
import { longify } from "@cosmjs/stargate/build/queryclient";


const rpc = "127.0.0.1:26657";

const getAliceSignerFromPriKey = async (): Promise<OfflineDirectSigner> => {
    return DirectSecp256k1Wallet.fromKey(
        fromHex((await readFile("./simd.alice.private.key")).toString()),
        "cosmos",
    )
}

// const stringToArrayBuffer = (str) => {
//     let encoder = new TextEncoder();
//     return encoder.encode(str);
// }

const runAll = async (): Promise<void> => {
    // Connect to the local blockchain
    const client = await StargateClient.connect(rpc);
    const aliceSigner: OfflineDirectSigner = await getAliceSignerFromPriKey();
    const alice = (await aliceSigner.getAccounts())[0].address;
    console.log("Alice's address from signer", alice);
    const signingClient = await SigningStargateClient.connectWithSigner(rpc, aliceSigner);

    // Check the balance of Alice and the Faucet
    console.log("Alice balance before:", await client.getAllBalances(alice));

    const testProposal = await createProposal(alice, signingClient);

    const logs = JSON.parse(testProposal.rawLog || "");
    let proposalId = logs[0].events
        .find(({ type }: any) => type === "submit_proposal")
        .attributes.find(({ key }: any) => key === "proposal_id").value;
    console.log("Proposal Id:", proposalId);

    await vote(alice, signingClient, proposalId)

    console.log("Alice balance after:", await client.getAllBalances(alice));

}

async function createProposal(author: string, signingClient: SigningStargateClient) {
    const textProposal = TextProposal.fromPartial({
        title: "Test Proposal",
        description: "This proposal proposes to test whether this proposal passes",
    });

    const proposalMsg: MsgSubmitProposalEncodeObject = {
        typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
        value: {
            content: Any.fromPartial({
                typeUrl: "/cosmos.gov.v1beta1.TextProposal",
                value: Uint8Array.from(TextProposal.encode(textProposal).finish()),
            }),
            proposer: author,
            initialDeposit: [{ denom: "stake", amount: "10000000" }],
        },
    };

    const proposalResult = await signingClient.signAndBroadcast(
        author,
        [proposalMsg],
        {
            amount: coins(25000, "stake"),
            gas: "1500000",
        }
    );

    console.log("Submit proposal , tx hash:", proposalResult);

    return proposalResult;
}

async function vote(signer: string, signingClient: SigningStargateClient, proposalId: string) {
    // if (!(await signingClient.getDelegation(signer, validator.validatorAddress))) {
    //     const msgDelegate: MsgDelegateEncodeObject = {
    //         typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
    //         value: {
    //             delegatorAddress: signer,
    //             validatorAddress: validator.validatorAddress,
    //             amount: coin(1000000, "stake"),
    //         },
    //     };
    //     const result = await signingClient.signAndBroadcast(signer, [msgDelegate],
    //         {
    //             amount: coins(25000, "stake"),
    //             gas: "1500000",
    //         });
    // }

    const voteMsg: MsgVoteEncodeObject = {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: {
            proposalId: longify(proposalId),
            voter: signer,
            option: VoteOption.VOTE_OPTION_NO,
        },
    };
    const voteResult = await signingClient.signAndBroadcast(signer, [voteMsg],
        {
            amount: coins(25000, "stake"),
            gas: "1500000",
        });

    console.log("Make a vote, tx hash:", voteResult);
}



runAll()
