/** Standard modes supported across endpoints */
export type StandardMode = "normal" | "chaos" | "corporate" | "security";

/** Extra fun modes (optional per endpoint) */
export type ExtraMode = "wholesome" | "toxic" | "sarcastic" | "devops";

export type Mode = StandardMode | ExtraMode;

export interface Endpoint {
  name: string;
  description: string;
  /** Supported modes — normal is required for all endpoints */
  modes: readonly Mode[];
  examples: readonly string[];
  /** Mode-specific examples; falls back to examples when absent */
  examplesByMode?: Partial<Record<Mode, readonly string[]>>;
}

export type EndpointsMap = Record<string, Endpoint>;

export type Format = "json" | "text" | "shields";
