"use client";
import { useAccount, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

const ProfileENS = () => {
  const { address } = useAccount();
  const { data, error, status } = useEnsName({ address, chainId: mainnet.id });

  if (status === "pending") return <div>Loading ENS name</div>;
  if (status === "error")
    return <div>Error fetching ENS name: {error.message}</div>;
  return <div>ENS name: {data}</div>;
};

export default ProfileENS;
