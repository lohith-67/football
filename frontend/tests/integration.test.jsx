import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpsAuthModal } from '../components/OpsAuthModal.jsx';

// Mock fetch for the API call
beforeEach(() => {
    global.fetch = vi.fn();
});

describe('OpsAuthModal Integration', () => {
    it('gates access correctly with a valid passcode', async () => {
        // Mock appContext
        const mockSetOpsToken = vi.fn();
        const mockSetMode = vi.fn();
        const mockSetIsOpsAuthModalOpen = vi.fn();

        window.useAppContext = () => ({
            isOpsAuthModalOpen: true,
            setIsOpsAuthModalOpen: mockSetIsOpsAuthModalOpen,
            setOpsToken: mockSetOpsToken,
            setMode: mockSetMode,
        });

        // Mock successful backend response
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'mock-valid-token' })
        });

        render(<OpsAuthModal />);

        // Type passcode
        const input = screen.getByPlaceholderText('Enter passcode');
        fireEvent.change(input, { target: { value: 'VALID_PASS' } });

        // Submit
        const submitBtn = screen.getByRole('button', { name: 'Enter' });
        fireEvent.click(submitBtn);

        // Verify API was called
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/api/ops/verify', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ passcode: 'VALID_PASS' })
            }));
        });

        // Verify state updates upon success
        expect(mockSetOpsToken).toHaveBeenCalledWith('mock-valid-token');
        expect(mockSetIsOpsAuthModalOpen).toHaveBeenCalledWith(false);
        expect(mockSetMode).toHaveBeenCalledWith('ops');
    });

    it('displays error on invalid passcode', async () => {
        window.useAppContext = () => ({
            isOpsAuthModalOpen: true,
            setIsOpsAuthModalOpen: vi.fn(),
            setOpsToken: vi.fn(),
            setMode: vi.fn(),
        });

        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        render(<OpsAuthModal />);

        fireEvent.change(screen.getByPlaceholderText('Enter passcode'), { target: { value: 'WRONG' } });
        fireEvent.click(screen.getByRole('button', { name: 'Enter' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid passcode')).toBeDefined();
        });
    });

    it('disables submit button on empty passcode', async () => {
        window.useAppContext = () => ({
            isOpsAuthModalOpen: true,
            setIsOpsAuthModalOpen: vi.fn(),
            setOpsToken: vi.fn(),
            setMode: vi.fn(),
        });

        render(<OpsAuthModal />);
        
        // Passcode input is initially empty
        const submitButton = screen.getByRole('button', { name: 'Enter' });
        expect(submitButton.disabled).toBe(true);
    });

    it('displays generic error on malformed/500 API response', async () => {
        window.useAppContext = () => ({
            isOpsAuthModalOpen: true,
            setIsOpsAuthModalOpen: vi.fn(),
            setOpsToken: vi.fn(),
            setMode: vi.fn(),
        });

        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        render(<OpsAuthModal />);

        fireEvent.change(screen.getByPlaceholderText('Enter passcode'), { target: { value: 'ANY' } });
        fireEvent.click(screen.getByRole('button', { name: 'Enter' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid passcode')).toBeDefined();
        });
    });
});
