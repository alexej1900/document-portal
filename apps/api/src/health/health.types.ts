export type Health = {
    status: string;
    uptime: number;
    timestamp: string;
};

export type Readiness = {
    status: 'ok';
    database: 'up';
};
