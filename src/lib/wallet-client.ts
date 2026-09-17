import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  walletLogout,
  walletRequestCode,
  walletRequestTopUp,
  walletState as walletStateFn,
  walletVerifyCode,
  type WalletState,
} from "@/lib/wallet.functions";

const EMPTY: WalletState = { phone: null, balance: 0, transactions: [], referrals: [] };

export function useWallet() {
  const load = useServerFn(walletStateFn);
  const requestCode = useServerFn(walletRequestCode);
  const verifyCode = useServerFn(walletVerifyCode);
  const signOutFn = useServerFn(walletLogout);
  const topUpFn = useServerFn(walletRequestTopUp);

  const [state, setState] = useState<WalletState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    load()
      .then((res) => active && setState(res))
      .catch(() => undefined)
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, [load]);

  const sendCode = useCallback(
    async (phone: string) => {
      await requestCode({ data: { phone } });
    },
    [requestCode],
  );

  const verify = useCallback(
    async (phone: string, code: string) => {
      const res = await verifyCode({ data: { phone, code } });
      if (res.ok && res.state) setState(res.state);
      return res.ok;
    },
    [verifyCode],
  );

  const signOut = useCallback(async () => {
    await signOutFn();
    setState(EMPTY);
  }, [signOutFn]);

  const requestTopUp = useCallback(
    async (amount: number) => {
      const next = await topUpFn({ data: { amount } });
      setState(next);
    },
    [topUpFn],
  );

  const refresh = useCallback(async () => {
    setState(await load());
  }, [load]);

  return {
    state,
    ready,
    loggedIn: Boolean(state.phone),
    sendCode,
    verify,
    signOut,
    requestTopUp,
    refresh,
  };
}
