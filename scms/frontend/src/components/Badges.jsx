export const StatusBadge = ({ status }) => {
    const statusConfig = {
        OPEN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        ASSIGNED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };

    const configClass = statusConfig[status] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${configClass}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

export const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
        LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        HIGH: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    const configClass = priorityConfig[priority] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${configClass}`}>
            {priority}
        </span>
    );
};
